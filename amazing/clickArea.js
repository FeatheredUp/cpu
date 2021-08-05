class ClickArea{
    name;
    startX;
    startY;
    endX;
    endY;
    found;
    constructor(name, startX, startY, endX, endY){
        this.name = name;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.found = false;
    }

    getCentre() {
        return {x: (this.startX + this.endX) / 2, y: (this.startY + this.endY) / 2};
    }

    getRadius() {
        return Math.max(this.endX - this.startX, this.endY - this.startY) / 2;
    }

    isFound() {
        this.found = true;
    }

    width() {
        return this.endX - this.startX;
    }

    height() {
        return this.endY - this.startY;
    }
}

class ClickAreas{
    clickAreas = [];
    defaultArea = null;

    addArea(name, startX, startY, endX, endY) {
        this.clickAreas.push(new ClickArea(name, startX, startY, endX, endY));
    }

    setDefaultZone(name, startX, startY, endX, endY) {
        this.defaultArea = new ClickArea(name, startX, startY, endX, endY);
    }

    getArea(x, y) {
        for (const area of this.clickAreas) {
            let hit = !area.found && area.startX < x && x < area.endX && area.startY < y && y < area.endY;
            if (hit) {
                return area;
            }
        }
        return this.defaultArea;
    }
}