module.exports = class Statistics {
    constructor(){
        this.requests = 0;
        this.commits = 0;
        this.startTime = new Date().toLocaleString();
        this.endTime = null;
        this.active = true;
    }

    end() {
        this.endTime = new Date().toLocaleString();
        this.active = false;
    }

    commit() {
        this.commits++;
    }

    request() {
        this.requests++;
    }

    getJSON() {
        return [{
            start: (this.startTime == 0) ? '' : this.startTime,
            endTime: (this.endTime == 0) ? '' : this.endTime,
            requests: this.requests,
            commits: this.commits
        }];
    }
};