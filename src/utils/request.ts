import { Octokit } from "@octokit/rest";
import { TOKENS } from "./constant";
import { Base64 } from "js-base64";

const owner = "lin-dongyizhi7";
const repo = "snack-free-data-store";

// 获取GitHub文件内容
export const fetchGitHubFile = async (path: string, trans: boolean = true) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (trans) {
      // 文件内容以 Base64 编码存储，需要进行解码
      const fileData = data as { content: string };
      const content = Base64.decode(fileData.content);
      const jsonData = JSON.parse(content);
      return jsonData;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

// 获取GitHub文件夹信息
export const fetchGitHubFileFolder = async (path: string) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data)) {
      return data;
    } else {
      console.log("Not file list");
      return null;
    }
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

// 更新GitHub文件
export const updateGitHubFile = async (
  path: string,
  newContent: string,
  commitMessage: string
) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const fileData = response.data;
    if (Array.isArray(fileData)) {
      throw new Error("Path points to a directory, not a file.");
    }

    const currentSHA = fileData.sha; // 获取文件的 SHA 值

    // 修改文件内容，将新内容转换为 Base64 编码
    const content = Base64.encode(newContent);

    // 提交更改
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: commitMessage, // 提交信息
      content, // 新的文件内容（Base64编码）
      sha: currentSHA, // 当前文件的SHA值
      branch: "main", // 提交的main分支
    });
    console.log("File updated successfully!");
  } catch (error) {
    console.error("Error updating file:", error);
  }
};

// 上传文件到GitHub
export const uploadFileToGithub = async (
  fileList: any[],
  pathPrefix: string
) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    for (const file of fileList) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file.raw);
      await new Promise<void>((resolve) => {
        reader.onload = async () => {
          let base64Content = "";
          if (reader.result instanceof ArrayBuffer) {
            // 当 result 为 ArrayBuffer 类型时的处理
            const uint8Array = new Uint8Array(reader.result);
            let binary = "";
            for (let i = 0; i < uint8Array.length; i++) {
              binary += String.fromCharCode(uint8Array[i]);
            }
            base64Content = btoa(binary);
          } else if (typeof reader.result === "string") {
            // 当 result 为 string 类型时的处理
            base64Content = reader.result.split(",")[1];
          }

          const filePath = `${pathPrefix}${file.name}`;

          // 上传文件到 GitHub 仓库
          await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Upload ${file.name}`,
            content: base64Content,
            branch: "main",
          });
          resolve();
        };
      });
    }
    console.log("Mark successfully!");
  } catch (error) {
    console.error("Error uploading images:", error);
  }
};
