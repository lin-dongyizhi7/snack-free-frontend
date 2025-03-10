import { fetchGitHubFile, updateGitHubFile } from "../utils/request";

export const getMarkedDays = async (file: string): Promise<string[]> => {
  const content = await fetchGitHubFile(file);
  if (content) return content?.marked_date;
  else return Promise.resolve([]);
};

export const updateMarkedDays = async (marked_date: string[], file: string) => {
  const newContent = JSON.stringify({ marked_date });
  await updateGitHubFile(file, newContent, `update ${file}`);
};

// 测试GITHUB REST API
export const test = async () => {
  const newContent = `{
    "description": "yys yyds"
}`;
  const msg = "xxxxx";
  await updateGitHubFile("test.json", newContent, msg);
};
