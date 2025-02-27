import { fetchGitHubFile, updateGitHubFile } from "../utils/request";

export const getMarkedDays = async (): Promise<string[]> => {
  const content = await fetchGitHubFile("marked_date.json");
  if (content) return content?.marked_date;
  else return Promise.resolve([]);
};

export const updateMarkedDays = async (marked_date: string[]) => {
  const newContent = JSON.stringify(marked_date);
  await updateGitHubFile("test.json", newContent, "update marked_date.json");
};

// 测试GITHUB REST API
export const test = async () => {
  const newContent = `{
    "description": "yys yyds"
}`;
  const msg = "xxxxx";
  await updateGitHubFile("test.json", newContent, msg);
};
