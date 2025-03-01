import { Octokit } from "@octokit/rest";
import { TOKENS } from "../utils/constant";
import { Base64 } from "js-base64";

const owner = "lin-dongyizhi7";
const repo = "snack-free-data-store";

import { fetchGitHubFileFolder, fetchGitHubFile } from "../utils/request";

export const getImagesByDate = async (date: string, prefix: string) => {
  const path = prefix + date;
  const resources = await fetchGitHubFileFolder(path);
  if (resources) {
    console.log(resources);
    resources.forEach(async (file) => {
      const res = await fetchGitHubFile(file.path, false);
      console.log(res);
    });
    return Promise.resolve(resources.map((file) => file.download_url));
  } else return Promise.resolve([]);
};

interface FormData {
  desc: string;
  heart: number;
}
export const submitFormData = async (data: FormData, path: string) => {
  const str = JSON.stringify(data);
  const octokit = new Octokit({
    auth: TOKENS.ACCESS_TOKEN,
  });
  try {
    const content = Base64.encode(str);
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `${path} record`,
      content: content,
      branch: "main",
    });
    console.log("Submit form successfully!");
  } catch (error) {
    console.error("Error submit form:", error);
  }
};

export const getFormData = async (path: string): Promise<FormData> => {
  const res = await fetchGitHubFile(path);
  return res;
};
