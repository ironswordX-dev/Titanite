class BatteryDisplay {
    eventNames = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange'];

    constructor(element) {
        this.element = element;
        this.render();
        this.listenForUpdates()
    }

    getBattery() {
        return navigator.getBattery().catch(() => reportError("Error reading battery."));
    }

    async render() {
        let battery = await this.getBattery();
        let arr = [
            this.getPercentMessage(battery),
            this.getChargingMessage(battery),
            this.getTimeMessage(battery)
        ]
        this.element.textContent = arr.filter((v) => v !== null).join(" ~ ");
    }

    isBatteryFull(batt) {
        return (batt.charging && Math.min(batt.chargingTime, batt.dischargingTime)) == Infinity;
    }
    getPercentMessage(battery) {
        if (this.isBatteryFull(battery)) return "Battery Full"
        return `Battery: ${Math.round(battery.level * 100)}%`
    }

    getChargingMessage(battery) {
        if (this.isBatteryFull(battery)) return null;
        return battery.charging ? "Charging" : "Not charging"
    }

    getTimeMessage(battery) {
        let secsLeft = Math.min(battery.chargingTime, battery.dischargingTime)
        let direction = battery.charging ? "full" : "empty"

        if (this.isBatteryFull(battery)) return null;

        let hoursLeft = Math.floor(secsLeft / 3600)
        let minsLeft = Math.floor(secsLeft % 3600 / 60);
        minsLeft = Number(String(minsLeft).padStart(2, 0) /* 8:9 to 8:09 etc */ );

        // default values to null
        if (hoursLeft === Infinity) hoursLeft = null;
        if (minsLeft === Infinity || minsLeft === "NaN") minsLeft = null;

        //hoursLeft = Number(hoursLeft) === 0 ? hoursLeft = null : hoursleft = ` ${hoursLeft} hours `;
        //minsLeft = Number(minsLeft) === 0 || minsLeft === "--" ? "left" : `and ${minsLeft} minutes left`

        // i know, this code is messy but it works at least
        let hoursLeftNumb = hoursLeft;
        if (hoursLeft !== "--") {
            switch(true) {
                case hoursLeft == 0:
                    hoursLeft = null;
                    break;
                case hoursLeft > 0:
                    hoursLeft = ` ${hoursLeft} hours`;
                    break;
            }
        }
        if (minsLeft !== "--") {
            switch(true) {
                case minsLeft == 0:
                    minsLeft = null;
                    break;
                case minsLeft > 0 && hoursLeftNumb > 0:
                    minsLeft = `and ${minsLeft} minutes`;
                    break;
                case minsLeft > 0 && !(hoursLeftNumb > 0):
                    minsLeft = `${minsLeft} minutes`;
                    break;
            }
        }

        if (!(hoursLeft === null || hoursLeft === NaN) && !(minsLeft === null)) {
            return `Around ${hoursLeft} ${minsLeft} left until battery is ${direction}`
        } else if (!(hoursLeft === null)) {
            return `Around ${hoursLeft} left until battery is ${direction}`
        } else if (!(minsLeft === null)) {
            return `Around ${minsLeft} left until battery is ${direction}`
        } else {
            return 'Waiting on battery info...'
        }
    }

    async listenForUpdates() {
        let battery = await this.getBattery();

        for (let eventName of this.eventNames) {
            battery.addEventListener(eventName, this.render.bind(this))
        }
    }
}

export default BatteryDisplay