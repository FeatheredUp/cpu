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
    game;
    menuHolder;
    buttons = [];
    simplifyFunction;
    highlightedButton = 'none';
    duringClick = false;
    constructor(game, simplifyFunction) {
        this.simplifyFunction = simplifyFunction;
        this.game = game;
        this.menuHolder = document.getElementById('menu');
        if (this.menuHolder == null || this.menuHolder == undefined) return;

        if (game.isPuzzle)
            this.menuHolder.src = "../images/menu.png"
        else 
            this.menuHolder.src = "../images/menu2.png";

        this.menuHolder.width = 350;
        this.menuHolder.height = 150;
        this.menuHolder.addEventListener('click', (event) => {this.clickMenu(event.pageX, event.pageY);}, false);
        this.menuHolder.addEventListener('mousemove', (event) => {this.mousemoveMenu(event.pageX, event.pageY);}, false);

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
                this.hoverOnButton('none');
                this.duringClick = true;
                window.setTimeout(f => this.actOnButton(button.name), 100);
            }
        }
    } 
    
    mousemoveMenu(pageX, pageY) {
        let canvasLeft = this.menuHolder.offsetLeft + this.menuHolder.clientLeft,
            canvasTop = this.menuHolder.offsetTop + this.menuHolder.clientTop,
            x = pageX - canvasLeft,
            y = pageY - canvasTop;
       for (const button of this.buttons) {
           if (button.isInBounds(x,y)) {
            this.hoverOnButton(button.name);
            return;
           }
       }
       this.hoverOnButton('none');
    }

    hoverOnButton(buttonName) {
        if (this.highlightedButton == buttonName) return;
        if (this.duringClick) return;
        this.highlightedButton = buttonName;
        if (this.game.map.currentPage.isPuzzle) {
            switch (buttonName) {
                case 'home':
                    this.menuHolder.src = "../images/menu_home.png";
                    return;
                case 'hint':
                    this.menuHolder.src = "../images/menu_hint.png";
                    return;
                case 'help' :
                    this.menuHolder.src = "../images/menu_help.png";
                    return; 
                case 'none' :
                    this.menuHolder.src = "../images/menu.png";
                    return;
            }
        } else {
            switch (buttonName) {
                case 'home':
                    this.menuHolder.src = "../images/menu2_home.png";
                    return;
                case 'none' :
                    this.menuHolder.src = "../images/menu2.png";
                    return;
            }
        }
    }

    actOnButton(buttonName) {
        this.duringClick = false;
        switch (buttonName) {
            case 'home':
                this.game.goHome();
                return;
            case 'hint':
                 if (this.game.map.currentPage.isPuzzle) this.actOnHint();
                return;
            case 'help' :
                if (this.game.map.currentPage.isPuzzle) this.game.showHelp();
                return;
        }
    }

    actOnHint() {
        // If there is no simplify, there is nothing to do
        if (this.simplifyFunction == null) {
            alert('There is no easy option here');
            return;
        }

        const simplified = this.game.requestSimplify();
        if (simplified) {
            // Now tell the current page that the simplify was activated
            if (this.simplifyFunction != null) this.simplifyFunction();
        }
    }
}


class StoryMap {
    pages = [];
    currentPage = null;
    constructor() {
        let json = localStorage.getItem('pages');
        if (!json) {
            json = '[{"name":"Terminal.html", "next":"Office.html?1", "isUnlocked":true},' +
                    '{"name":"Office.html?1", "next":"Phone.html?1"}, ' +
                    '{"name":"Phone.html?1", "next":"CityMap.html?1"}, ' +
                    '{"name":"CityMap.html?1", "next":"Saberton.html?1"}, ' +
                    '{"name":"Saberton.html?1", "next":"Saberton.html?2"}, ' +
                    '{"name":"Saberton.html?2", "next":"Flowerbed.html"}, ' +
                    '{"name":"Flowerbed.html", "next":"CityMap.html?2", "isPuzzle": true}, ' +
                    '{"name":"CityMap.html?2", "next":"WordString.html"}, ' +
                    '{"name":"WordString.html", "next":"CityMap.html?3", "isPuzzle": true}, ' +
                    '{"name":"CityMap.html?3", "next":"flow.html"}, ' +
                    '{"name":"flow.html", "next":"tetriCross.html", "isPuzzle": true}, ' +
                    '{"name":"tetriCross.html", "next":"", "isPuzzle": true}]';
            localStorage.setItem('pages', json);
        }

        console.log(json);

        const jsonMap = JSON.parse(json);
        for (const jsonPage of jsonMap) {
            const page = new Page(jsonPage.name, jsonPage.next, jsonPage.isUnlocked, jsonPage.simplifies, jsonPage.isPuzzle);
            this.pages.push(page);
            
            // Find last unlocked page
            if (page.isUnlocked) this.currentPage = page;
        }
    }
    
    getPage(name) {
        for (const page of this.pages) {
            if (page.name == name) return page;
        }
    }

    save() {
        const pages = JSON.stringify(this.pages);
        localStorage.setItem('pages', pages);
    }
}

class ListGames {
    constructor() {
        this.map = new StoryMap();
        
        const ul = document.createElement('ul');
        for (const page of this.map.pages) {
            if (page.isPuzzle) {
                const a = document.createElement('a');
                a.href = page.name + '?direct';
                a.innerText = page.name;

                const li = document.createElement('li');
                li.appendChild(a);
                ul.appendChild(li);
            }
        }
        document.getElementById('list').appendChild(ul);
    }
}

class Game {
    simplification;
    menu;
    helpDescription;
    isPuzzle = false;
    extraHelpText= 'Press the yellow magnify button to show or hide this information.';
    developerAccess = false;
    currentPage = null;
    map = null;

    constructor(simplifyFunction, helpDescription) {
        this.map = new StoryMap();

        // find latest place and if that's different than the current page, move them there
        const currentPageName = this.getCurrentPageName();

        if (currentPageName.toLowerCase() == 'list.html') {
            this.displayPuzzleList();
            return;
        }

        if (this.goingDirect(currentPageName)) {
            this.developerAccess = true;
            this.map.currentPage = this.map.getPage(this.getJustCurrentPageName());
        } else if (this.map.currentPage.name != currentPageName) {
            window.location.href = this.map.currentPage.name;
        }

        this.isPuzzle = this.map.currentPage.isPuzzle;

        this.simplification = new Simplification();

        this.checkUnlock();

        this.menu = new Menu(this, simplifyFunction);
        this.helpDescription = helpDescription;
    }

    initialiseHelp() {
        let helpPanel = document.getElementsByClassName('helpPanel');
        if (helpPanel?.length > 0) return; 

        const page = document.getElementsByClassName('page')[0];
        helpPanel = document.createElement('div');
        helpPanel.className = 'helpPanel hidden';

        const helpText = document.createElement('div');
        helpText.className = 'helpPanelText';
        helpPanel.appendChild(helpText);
        
        const helpTextExtra = document.createElement('div');
        helpTextExtra.className = 'helpPanelTextExtra';
        helpTextExtra.innerText = this.extraHelpText;
        helpPanel.appendChild(helpTextExtra);

        const button = document.createElement('button');
        button.className = 'helpPanelButton';
        button.innerText = 'OK';
        button.addEventListener('click', (event) => {this.toggleHidden(helpPanel);}, false);

        helpPanel.appendChild(button);

        page.appendChild(helpPanel);
    }

    goingDirect(currentPageName) {
        return currentPageName.endsWith('?direct');
    }

    showHelp() {
        this.initialiseHelp();

        const helpPanel = document.getElementsByClassName('helpPanel')[0];
        this.toggleHidden(helpPanel);
       
        const helpText = document.getElementsByClassName('helpPanelText')[0];
        helpText.innerText = this.helpDescription;
    }

    toggleHidden(control) { 
        if (!control?.classList?.contains) return;
        if (control.classList.contains('hidden')) {
            control.classList.remove('hidden');
        } else {
            control.classList.add('hidden');
        }
    }

    checkUnlock() {
        if (this.developerAccess) return;
        if (this.map.currentPage.isUnlocked) return;
        window.location.href = "error.html";
    }

    unlockNext() {
        if (this.developerAccess) {
            window.location.href = "list.html";
            return;
        }

        const nextPageName = this.map.currentPage.next;
        const nextPage = this.map.getPage(nextPageName);
        if (!nextPage) return;

        nextPage.unlock();
        this.map.save();
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
            this.map.currentPage.simplify();
            this.map.save();
        }

        return confirm;
    }

    goHome() {
        if (this.isPuzzle) {
            const confirm = window.confirm(`Do you want to return to the home page?  You will lose any progress on the current puzzle, and will resume at the start of the current puzzle on return.`);
            if (confirm) { 
                window.location.href = '../home.html';
            }
        } else {
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

    getJustCurrentPageName() {
        return window.location.href.split("/").pop().split('?')[0];
    }
}