// Represents the colours used
class ColourScheme {
    name;
    back;
    touched;
    flow;
    noFlow;
    flowStart;
    flowHighlight;
    invisible;
    finished;

    constructor(name, back, touched, flow, noFlow, flowStart, flowHighlight, invisible, finished) {
        this.name = name;
        this.back = back;
        this.touched = touched;
        this.flow = flow;
        this.noFlow = noFlow;
        this.flowStart = flowStart;
        this.flowHighlight = flowHighlight;
        this.invisible = invisible;
        this.finished = finished;
    }
}

class Options {
    colourScheme;

    //                                  name          back       touched    flow       no flow    start      highlight  invisible  finished
    defaultScheme    = new ColourScheme('default',    '#000000', '#333333', '#FF0000', '#FFFF00', '#0000FF', '#FFFFFF', '#FFFFFF', '#0000FF');
    monochromeScheme = new ColourScheme('monochrome', '#FFFFFF', '#EEEEEE', '#000000', '#AAAAAA', '#777777', '#FFFFFF', '#666666', '#FF0000');
    garishScheme     = new ColourScheme('garish',     '#05EFFF', '#FFFF00', '#FF0000', '#FF00FF', '#0000FF', '#FFFFFF', '#FFFFFF', '#0000FF');
    riverScheme      = new ColourScheme('river',      '#00AAFF', '#0077FF', '#0000AA', '#444444', '#000000', '#FFFFFF', '#FFFFFF', '#FF0000');

    allSchemes = [this.defaultScheme, this.monochromeScheme, this.garishScheme, this.riverScheme];

    constructor(colourSchemeName) {
        this.colourScheme = this.allSchemes.find((scheme) => scheme.name == colourSchemeName);
        if (!this.colourScheme) this.colourScheme = this.defaultScheme;
    }
}