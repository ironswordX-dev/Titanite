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
        minsLeft = String(minsLeft).padStart(2, 0) // 8:9 to 8:09 etc

        if (hoursLeft === Infinity) hoursLeft = "--";
        if (minsLeft === Infinity || minsLeft === "NaN") minsLeft = "--";

        minsLeft = Number(minsLeft) === 0 || minsLeft === "--" ? "left" : `and ${minsLeft} minutes left`

        return `Around ${hoursLeft} hours ${minsLeft} until ${direction}`
    }

    async listenForUpdates() {
        let battery = await this.getBattery();

        for (let eventName of this.eventNames) {
            battery.addEventListener(eventName, this.render.bind(this))
        }
    }
}

export default BatteryDisplay