import { Octokit } from "@octokit/rest";
import { TOKENS } from "./constant";
import { Base64 } from "js-base64";

const owner = "lin-dongyizhi7";
const repo = "snack-free-data-store";

export const fetchGitHubFile = async (path: string) => {
    // const url = `https://raw.githubusercontent.com/lin-dongyizhi7/snack-free-data-store/main/${path}`;
  try {
    const octokit = new Octokit({
      auth: TOKENS.ACCESS_TOKEN,
    });

    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    console.log(data);
    // 文件内容以 Base64 编码存储，需要进行解码
    const content = Base64.decode(data.content);
    const jsonData = JSON.parse(content);

    console.log('JSON 文件内容:', jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

export const updateGitHubFile = async (
  path: string,
  newContent: string,
  commitMessage: string
) => {
  try {
    const octokit = new Octokit({
      auth: TOKENS.ACCESS_TOKEN,
    });
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
    const result = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: commitMessage, // 提交信息
      content, // 新的文件内容（Base64编码）
      sha: currentSHA, // 当前文件的SHA值
      branch: "main", // 提交的main分支
    });
    console.log(result);
    console.log("File updated successfully!");
  } catch (error) {
    console.error("Error updating file:", error);
  }
};
