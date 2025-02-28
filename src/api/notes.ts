import { Octokit } from "@octokit/rest";
import { TOKENS } from "../utils/constant";

const owner = "lin-dongyizhi7";
const repo = "snack-free-data-store";

export const getNotes = async (path: string) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    return data.filter((item) => item.type === "file");
  } catch (error) {
    console.error("获取笔记列表失败:", error);
    return [];
  }
};

export const getNoteContent = async (path: string) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    return atob(data.content);
  } catch (error) {
    console.error("获取笔记内容失败:", error);
    return "";
  }
};

export const createNote = async (
  fileName: string,
  content: string,
  path: string
) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `${path}/${fileName}`,
      message: `Create note: ${fileName}`,
      content: btoa(content),
    });
    console.log("笔记创建成功");
  } catch (error) {
    console.error("创建笔记失败:", error);
  }
};

export const updateNote = async (
  path: string,
  content: string,
  sha: string
) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update note: ${path}`,
      content: btoa(content),
      sha,
    });
    console.log("笔记更新成功");
  } catch (error) {
    console.error("更新笔记失败:", error);
  }
};

export const deleteNote = async (path: string, sha: string) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    await octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message: `Delete note: ${path}`,
      sha,
    });
    console.log("笔记删除成功");
  } catch (error) {
    console.error("删除笔记失败:", error);
  }
};
