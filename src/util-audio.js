
class DelayLine {
    
}


var DelayLine = (function(context) {

    var DelayLine = function(context) {
        this.context = context;
        this.audioIn = this.context.createGain();
        this.audioOut = this.context.createGain();
        this.delay = this.context.createDelay();
        this.filter = this.context.createBiquadFilter();

        this.init();
    }

    DelayLine.prototype.constructor = DelayLine;

    DelayLine.prototype.init = function() {
        // init function
        var self = this,
            context = self.context;

        self.audioIn.connect(self.delay);
        self.delay.connect(self.filter);
        self.filter.connect(self.audioOut);
        self.audioOut.connect(context.destination);
    }

    DelayLine.prototype.connect = function(node) {
        this.audioOut.connect(node);
    }

    return DelayLine;

})();