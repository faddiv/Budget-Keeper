import * as firebase from "firebase/app";
import "firebase/firestore";
import { ArticleModel } from "./models";

class ArticleService {

    private get db() {
        return firebase.firestore();
    }
    private articleCollection() {
        return this.db.collection("articles");
    }

    private sortedArticleCollection() {
        return this.articleCollection()
            .orderBy("occurence", "desc");
    }

    private async * getArticles() {
        const articles = this.sortedArticleCollection();

        const qs = await articles.get();
        if (qs.empty) {
            return;
        }

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < qs.size; index++) {
            yield qs.docs[index].data() as ArticleModel;
        }
    }

    private createHighlight(name: string, pattern: string) {
        let pi = 0;
        let start = false;
        let result = "";
        let index = 0;
        name = name.toLowerCase();
        pattern = pattern.toLowerCase();
        for (; index < name.length && pi < pattern.length; index++) {
            const ch = name[index];
            if (ch === pattern[pi]) {
                if (!start) {
                    start = true;
                    result += "<strong>";
                }
                pi++;
            } else if (start) {
                result += "</strong>";
                start = null;
            }
            result += ch;
        }
        if (start) {
            result += "</strong>";
        }
        if (index < name.length) {
            result += name.substr(index);
        }
        return result;
    }

    public async searchArticles(text: string, limit = 25) {
        const regex = new RegExp(`^.*?${text.split("").join(".*?")}.*?$`, "i");
        const articles: ArticleModel[] = [];
        for await (const article of this.getArticles()) {
            const match = regex.exec(article.name);
            if (match !== null) {
                article.nameHighlighted = this.createHighlight(article.name, text);
                articles.push(article);
                if (articles.length >= limit) {
                    return articles;
                }
            }
        }
        return articles;
    }

}

export const articleService = new ArticleService();
