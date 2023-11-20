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
        let battery = await this.getBattery()

        this.element.textContent = [
            this.getPercentMessage(battery),
            this.getChargingMessage(battery),
            this.getTimeMessage(battery)
        ].filter(v => typeof v !== "undefined").join(" ~ ");
    }

    get isBatteryFull() {
        return (battery.charging && Math.min(battery.chargingTime, battery.dischargingTime)) == Infinity;
    }
    getPercentMessage(battery) {
        if (this.isBatteryFull) return "Battery Full"
        return `Battery: ${Math.round(battery.level * 100)}%`
    }

    getChargingMessage(battery) {
        if (this.isBatteryFull) return;
        return battery.charging ? "Charging" : "Not charging"
    }

    getTimeMessage(battery) {
        let secsLeft = Math.min(battery.chargingTime, battery.dischargingTime)
        let direction = battery.charging ? "full" : "empty"

        if (this.isBatteryFull) return;

        let hoursLeft = Math.floor(secsLeft / 3600)
        let minsLeft = Math.floor(secsLeft % 3600 / 60);
        minsLeft = String(minsLeft).padStart(2, 0) // 8:9 to 8:09 etc

        return `Around ${hoursLeft}:${minsLeft} until ${direction}`
    }

    async listenForUpdates() {
        let battery = await this.getBattery();

        for (let eventName of this.eventNames) {
            battery.addEventListener(eventName, this.render.bind(this))
        }
    }
}

export default BatteryDisplay