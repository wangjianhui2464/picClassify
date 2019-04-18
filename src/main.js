/**
 * Created by Dennis Wang
 * on 2019-04-17 22:51
 */
const exifTool = require("exiftool-vendored").exiftool;
const fs = require("fs");
const imageInfo = require("imageinfo");

// const imgPath = "/Users/Dennis/Downloads/归档下载/009-图片壁纸";
const imgPath =
  "/Users/Dennis/Downloads/归档下载/009-图片壁纸/个人图片/测试2/测试2-2";
const writePath = "/Users/Dennis/Downloads/PicClassify";

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

      /*
        读取文件精确元信息获取时间，建立对应文件夹。
        TODO：判断文件夹是否存在，递归创建
       */
      if (!fs.existsSync(writePath)) {
        fs.mkdirSync(writePath);
      }

      // 读取文件精确元信息获取时间，建立对应文件夹。
      exifTool
        .read(currFilePath)
        .then(tags => {
          console.log(Object.keys(tags));

          // TODO：读取元信息：
          // 优先：CreateData.rawValue、ModifyData.rawValue
          // 其次：FileModifyData.rawValue、DataTimeOriginal.rawValue
          // 然后：Make:"Apple"、Model:"iPhone 6 Plus"
          // FileType、FileName、Directory、MIMEType、Software

          fs.writeFileSync(
            writePath + "/" + fileName + ".json",
            JSON.stringify(tags)
          );
          console.log("\n\n");
        })
        .catch(error => console.error(error));
    }

    // this.classifyPic();
  }


  recursiveMkdir(){

  }

  /**
   * 通过时间信息建立以时间为维度的文件夹
   */
  classifyPic() {
    this.moveImg();
  }

  /**
   * 将该文件移动到该文件夹下面
   */
  moveImg() {}
}

let go = new Main();
go.getCurrPathFiles(imgPath);
