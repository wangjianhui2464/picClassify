/**
 * Created by Dennis Wang
 * on 2019-04-17 22:51
 */
const exif = require("exif-js");
const fs = require("fs");
const imageInfo = require("imageinfo");

const imgPath = "/Users/Dennis/Downloads/归档下载/009-图片壁纸";

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
          this.handleFile(currFilePath, fileName, fileStat);
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
      //  判断文件类型
      if (fileName) {
        let data = fs.readFileSync(currFilePath);

        let imgInfo = imageInfo(data);
        console.log(
          `                文件 imgInfo：`,
          JSON.stringify(imgInfo),
          "\n"
        );
      }
    } else {
      console.log("   忽略文件：" + fileName);
    }
    // this.classifyPic();
  }

  readFileInfo() {}

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
