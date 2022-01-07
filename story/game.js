class Page {
    name;
    next;
    isUnlocked = false;
    simplifies = 0;
    constructor(name, next, isUnlocked, simplifies) {
        this.name = name;
        this.next = next;
        this.isUnlocked = isUnlocked;
        this.simplifies = simplifies ?? 0;
    }

    unlock() {
        this.isUnlocked = true;
    }

    simplify() {
        this.simplifies += 1;
    }
}

class Simpification {
    count;
    constructor() {
        let count = localStorage.getItem('simplifyCount');
        if (!count) {
            count = 10;
            localStorage.setItem('simplifyCount', count);
        }
        this.count = count;
    }

    decrease() {
        if (this.count <= 0) return false;
        this.count -= 1;
        localStorage.setItem('simplifyCount', this.count);
        return true;
    }
}

class StoryMap {
    pages = [];
    simplification;
    constructor() {
        let json = localStorage.getItem('pages');
        if (!json) {
            json = '[{"name":"OS.html", "next":"Office.html?1", "isUnlocked":true},' +
                    '{"name":"Office.html?1", "next":"Phone.html?1"}, ' +
                    '{"name":"Phone.html?1", "next":"CityMap.html?1"}, ' +
                    '{"name":"CityMap.html?1", "next":"Saberton.html?1"}, ' +
                    '{"name":"Saberton.html?1", "next":"Saberton.html?2"}, ' +
                    '{"name":"Saberton.html?2", "next":"Saberton.html?3"}, ' +
                    '{"name":"Saberton.html?3", "next":"BrainHack1.html"}, ' +
                    '{"name":"BrainHack1.html", "next":"CityMap.html?2"}, ' +
                    '{"name":"CityMap.html?2", "next":""}]';
            localStorage.setItem('pages', json);

        }

        console.log(json);

        const jsonMap = JSON.parse(json);
        for (const jsonPage of jsonMap) {
            const page = new Page(jsonPage.name, jsonPage.next, jsonPage.isUnlocked, jsonPage.simplifies);
            this.pages.push(page);
        }

        // find latest place and if that's different than the current page, move them there
        const currentPageName = this.getCurrentPageName();
        console.log(currentPageName);
        const lastPage = this.getLastPage();
        console.log(lastPage.name);

        if (lastPage.name != currentPageName) {
            window.location.href = lastPage.name;
        }

        this.simplification = new Simpification();

        this.checkUnlock();
    }

    checkUnlock() {
        const currentPageName = this.getCurrentPageName();
        const currentPage = this.getPage(currentPageName);

        if (currentPage && currentPage.isUnlocked) return;
        window.location.href = "error.html";
    }

    unlockNext() {
        const currentPage = this.getCurrentPageInfo();
        if (!currentPage) return "";

        const nextPageName = currentPage.next;
        const nextPage = this.getPage(nextPageName);
        if (!nextPage) return "";
        nextPage.unlock();
        this.save();
        window.location.href = nextPageName;
    }
    
    requestSimplify() {
        if (this.simplification.count <= 0) {
            window.alert("You do not have any Simplify tokens.");
            return;
        }

        const confirm = window.confirm(`Do you want to use a Simplify token to make this puzzle easier?\n You have ${this.simplification.count} Simplify token(s) currently.`);
        if (confirm) { 
            this.simplification.decrease();
            const currentPage = this.getCurrentPageInfo();
            currentPage.simplify();
            this.save();
        }

        return confirm;
    }

    getCurrentPageInfo() {
        const currentPageName = this.getCurrentPageName();
        return this.getPage(currentPageName);
    }

    /********   PRIVATE METHODS   *************/

    getPageParameter() {
        return window.location.search.substring(1);
    }
    getCurrentPageName() {
        return window.location.href.split("/").pop();
        //return window.location.pathname.split("/").pop().split(".")[0];
    }

    getPage(name) {
        for (const page of this.pages) {
            if (page.name == name) return page;
        }
    }

    getLastPage() {
        let unlockedPage = null;
        // Find last unlocked page
        for (const page of this.pages) {
            if (page.isUnlocked) unlockedPage = page;
        }

        return unlockedPage;
    }

    save() {
        const pages = JSON.stringify(this.pages);
        localStorage.setItem('pages', pages);
    }
}
