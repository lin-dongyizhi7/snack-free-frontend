import { Octokit } from "@octokit/rest";
import { TOKENS } from "../utils/constant";

const owner = "lin-dongyizhi7";
const repo = "snack-free-data-store";

export const getNotes = async (path: string) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    const { data }: any = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    return data.filter((item: any) => item.type === "file");
  } catch (error) {
    console.error("Get notes list fail:", error);
    return [];
  }
};

export const getNoteContent = async (path: string) => {
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    const { data }: any = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    return atob(data.content);
  } catch (error) {
    console.error("Get note content fail:", error);
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
      path: `${path}notes/${fileName}.md`,
      message: `Create note: ${fileName}.md`,
      content: btoa(content),
      branch: "main",
    });
    console.log("Note create succeed");
  } catch (error) {
    console.error("Note create fail:", error);
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
      branch: "main",
    });
    console.log("Note update succeed");
  } catch (error) {
    console.error("Note update fail:", error);
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
      branch: "main",
    });
    console.log("Note delete succeed");
  } catch (error) {
    console.error("Note delete succeed:", error);
  }
};
