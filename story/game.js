function loadImage(src, onload) {
    const img = new Image();
    img.onload = onload;
    img.src = src;
    return img;
}

class Page {
    name;
    next;
    isUnlocked = false;
    simplifies = 0;
    isPuzzle = false;
    constructor(name, next, isUnlocked, simplifies, isPuzzle) {
        this.name = name;
        this.next = next;
        this.isUnlocked = isUnlocked;
        this.simplifies = simplifies ?? 0;
        this.isPuzzle = isPuzzle;
    }

    unlock() {
        this.isUnlocked = true;
    }

    simplify() {
        this.simplifies += 1;
    }
}

class Simplification {
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
class ClickableRoundArea {
    name;
    centreX;
    centreY;
    radius;
    constructor(name, centreX, centreY, radius){
        this.name = name;
        this.centreX = centreX;
        this.centreY = centreY;
        this.radius = radius;
    }

    isInBounds(x, y) {
        // Find distance from x,y to centreX, centreY and compare to radius
        const distance = Math.hypot(x-this.centreX, y-this.centreY);
        return distance <= this.radius;
    }
}

class Menu {
    map;
    menuHolder;
    buttons = [];
    simplifyFunction;
    constructor(map, simplifyFunction) {
        this.simplifyFunction = simplifyFunction;
        this.map = map;
        this.menuHolder = document.getElementById('menu');
        if (this.menuHolder == null || this.menuHolder == undefined) return;

        this.menuHolder.src = "../images/menu.jpg";
        this.menuHolder.width = 350;
        this.menuHolder.height = 150;
        this.menuHolder.addEventListener('click', (event) => {this.clickMenu(event.pageX, event.pageY);}, false);

        this.buttons.push(new ClickableRoundArea('hint',  85, 80, 35));
        this.buttons.push(new ClickableRoundArea('home', 175, 60, 35));
        this.buttons.push(new ClickableRoundArea('help', 260, 80, 35));
    }

    clickMenu(pageX, pageY) {
        let canvasLeft = this.menuHolder.offsetLeft + this.menuHolder.clientLeft,
            canvasTop = this.menuHolder.offsetTop + this.menuHolder.clientTop,
            x = pageX - canvasLeft,
            y = pageY - canvasTop;
       for (const button of this.buttons) {
           if (button.isInBounds(x,y)) {
               this.actOnButton(button.name);
           }
       }
    }

    actOnButton(buttonName) {
        switch (buttonName) {
            case 'home':
                this.map.goHome();
                return;
            case 'hint':
                this.actOnHint();
                return;
            case 'help' :
                this.map.showHelp();
                return;
        }
    }

    actOnHint() {
        // If there is no simplify, there is nothing to do
        if (this.simplifyFunction == null) {
            alert('There is no easy option here');
            return;
        }

        const simplified = this.map.requestSimplify();
        if (simplified) {
            // Now tell the current page that the simplify was activated
            if (this.simplifyFunction != null) this.simplifyFunction();
        }
    }
}

class StoryMap {
    pages = [];
    simplification;
    menu;
    helpDescription;
    constructor(simplifyFunction, helpDescription) {
        let json = localStorage.getItem('pages');
        if (!json) {
            json = '[{"name":"Terminal.html", "next":"Office.html?1", "isUnlocked":true},' +
                    '{"name":"Office.html?1", "next":"Phone.html?1"}, ' +
                    '{"name":"Phone.html?1", "next":"CityMap.html?1"}, ' +
                    '{"name":"CityMap.html?1", "next":"Saberton.html?1"}, ' +
                    '{"name":"Saberton.html?1", "next":"Saberton.html?2"}, ' +
                    '{"name":"Saberton.html?2", "next":"Flowerbed.html"}, ' +
                    '{"name":"Flowerbed.html", "next":"CityMap.html?2", "isPuzzle": true}, ' +
                    '{"name":"CityMap.html?2", "next":""}]';
            localStorage.setItem('pages', json);

        }

        console.log(json);

        const jsonMap = JSON.parse(json);
        for (const jsonPage of jsonMap) {
            const page = new Page(jsonPage.name, jsonPage.next, jsonPage.isUnlocked, jsonPage.simplifies, jsonPage.isPuzzle);
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

        this.simplification = new Simplification();

        this.checkUnlock();

        this.menu = new Menu(this, simplifyFunction);
        this.helpDescription = helpDescription;
    }

    showHelp() {
        alert(this.helpDescription);
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

    goHome() {
        const confirm = window.confirm(`Do you want to return to the home page?  You will lose any progress on the current puzzle, and will resume at the start of the current puzzle.`);
        if (confirm) { 
            window.location.href = '../home.html';
        }
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
