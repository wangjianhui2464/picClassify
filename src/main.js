/**
 * Created by Dennis Wang
 * on 2019-04-17 22:51
 */
const exifTool = require("exiftool-vendored").exiftool;
const fs = require("fs");
const imageInfo = require("imageinfo");

// Mac
const imgPath = "/Users/Dennis/Downloads/PicClassify/001";
// const imgPath = "/Users/Dennis/Downloads/归档下载/009-图片壁纸/个人图片/测试2/测试2-2";
const writePath = "/Users/Dennis/Downloads/PicClassify/444";

// windows
// const imgPath = 'E:\\photos';
// const writePath = 'E:\\photosClassify';

class Main {
  /**
   * 循环现有路径下的目录层级
   * @param targetPath
   */
  getCurrPathFiles(targetPath) {
    console.log(`\n---切换路径：${targetPath}`);

    let filePath = fs.readdirSync(targetPath);

    if (filePath.length === 0) {
      console.log(`   [------] ${targetPath} is 空文件夹`);
    } else {
      // 获取到文件夹下的所有子元素
      filePath.map((fileName, index, array) => {
        if (fileName.startsWith(".")) {
          console.log(
            '------targetPath + "\\" + fileName----',
            targetPath + "\\" + fileName
          );
          return false;
        }
        const currFilePath = targetPath + "/" + fileName;

        let fileStat = fs.statSync(currFilePath);

        // 迭代处理各层级文件夹
        let isFile = fileStat.isFile();
        let isDir = fileStat.isDirectory();

        if (isFile) {
          //  处理单个文件信息; 点开头的隐藏文件忽略
          this.handleFile(currFilePath, fileName);
        } else if (isDir) {
          //  递归进去 文件夹 处理
          this.getCurrPathFiles(currFilePath);
        }
      });
    }
  }

  /**
   * 处理单个文件，读取信息，移动归类
   * @param currFilePath 当前文件路径带文件名
   * @param fileName 当前文件名
   * @param fileStat 当前文件对象
   */
  handleFile(currFilePath, fileName, fileStat) {
    //  读取现有文件信息，获取时间信息，
    if (!fileName.startsWith(".")) {
      console.log("   正常文件：" + currFilePath, "\n");

      // 读取文件精确元信息获取时间，建立对应文件夹。
      exifTool
        .read(currFilePath)
        .then(exifInfo => {
          // console.log(`CreateDate: ${exifInfo.CreateDate}, ModifyDate:${exifInfo.ModifyDate}, \n FileModifyDate:${exifInfo.FileModifyDate}, DateTimeOriginal:${exifInfo.DateTimeOriginal} `);
          console.log("----exifInfo---: ", exifInfo);

          // TODO：读取元信息：
          // 优先：CreateDate.rawValue、ModifyDate.rawValue
          // 其次：FileModifyDate.rawValue、DateTimeOriginal.rawValue
          // 然后：Make:"Apple"、Model:"iPhone 6 Plus"
          // FileType、FileName、Directory、MIMEType、Software
          let fileRealDate;
          if (exifInfo.CreateDate) {
            fileRealDate = exifInfo.CreateDate;
          } else if (!fileRealDate && exifInfo.ModifyDate) {
            fileRealDate = exifInfo.ModifyDate;
          } else if (!fileRealDate && exifInfo.FileModifyDate) {
            fileRealDate = exifInfo.FileModifyDate;
          } else if (!fileRealDate && exifInfo.DateTimeOriginal) {
            fileRealDate = exifInfo.DateTimeOriginal;
          }

          console.log(
            "------元信息 结果：------",
            currFilePath,
            fileRealDate.rawValue
          );

          /*
            读取文件精确元信息获取时间，建立对应文件夹。
            TODO：判断文件夹是否存在，递归创建
           */
          let targetPath = this.recursiveMkdir(writePath);

          /*
           * TODO: 读取文件需要判断文件是否重名
           * TODO：记录日志：处理文件计数。处理文件路径、文件名、处理前后的路径。
           */
          this.moveFile(targetPath, currFilePath, fileName, exifInfo);
        })
        .catch(error => console.error(error));
    }

    // this.classifyPic();
  }

  /**
   * TODO：处理文件夹：传入具体路径逐级判断文件夹，并创建
   * @param writePath
   */
  recursiveMkdir(writePath) {
    let targetPath = "";
    if (!fs.existsSync(writePath)) {
      fs.mkdirSync(writePath);
    }

    return targetPath;
  }

  /**
   * 将该文件移动到该文件夹下面
   * @param targetPath
   * @param filePath
   * @param oldFileName
   * @param exifInfo 元信息
   */
  moveFile(targetPath, filePath, oldFileName, exifInfo) {
    //TODO：临时测试将 元信息 写入json，后续写入对应规则的文件夹中。
    fs.writeFileSync(
      targetPath + "/" + oldFileName + ".json",
      JSON.stringify(exifInfo)
    );
    console.log("\n\n");
  }
}

let go = new Main();
go.getCurrPathFiles(imgPath);
