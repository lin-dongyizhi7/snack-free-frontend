// import { product_list } from "./../views/mall/products";
import {
  fetchGitHubFile,
  fetchGitHubFileFolder,
  updateGitHubFile,
} from "../utils/request";

export const getProductList = async (path: string) => {
  const jsonData = await fetchGitHubFile(path + "/products.json");
  const resources = await fetchGitHubFileFolder(path);
  const list = jsonData.product_list;
  list.forEach((item: any) => {
    const img = resources?.find((re) => re.name === item.image[0]);
    if (img) {
      item["showImg"] = img.download_url;
    }
  });
  return list;
};

export interface ProductData {
  id: number;
  name: string;
  link: string;
  image: string[];
  showImg: string;
  price: number;
  points: number;
}

export const addProductToGithub = async (path: string, data: string) => {
  await updateGitHubFile(path, data, "Update product list");
};

interface PointsData {
  total: number;
  cost: number;
  remain: number;
  count: number;
}

export const getPointsData = async (path: string): Promise<PointsData> => {
  const jsonData = await fetchGitHubFile(path);
  return jsonData;
};

export const updatePointsData = async (path: string, data: string) => {
  await updateGitHubFile(path, data, "Update points info");
};
