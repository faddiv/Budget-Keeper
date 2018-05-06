import { CategoryModel } from "./model";
import { ThenJson, buildUrl } from "helpers";

const urlBase = "/api/v1/Category";

class CategoryService {

    async filterBy(search: string, limit?: number): Promise<CategoryModel[]> {
        const url = buildUrl([urlBase], {
            search,
            limit
        });
        const response = await fetch(url.toString());
        const result = await ThenJson<CategoryModel[]>(response);
        return result;
    }
}

export const categoryService = new CategoryService();
