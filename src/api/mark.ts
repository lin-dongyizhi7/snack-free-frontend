import { fetchGitHubFileFolder, fetchGitHubFile } from "../utils/request";

export const getImagesByDate = async (date: string, prefix: string) => {
  const path = prefix + date;
  const resources = await fetchGitHubFileFolder(path);
  if (resources) {
    console.log(resources);
    resources.forEach(async (file)=> {
        const res = await fetchGitHubFile(file.path, false);
        console.log(res);
    })
    return Promise.resolve(resources.map((file) => file.download_url));
  } else return Promise.resolve([]);
};
