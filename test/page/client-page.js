import { Selector, t } from 'testcafe';

class Page {
    constructor () {
        this.loc_deviceTypeDropdown = Selector('#device_type');
        this.loc_deviceSortDropdown = Selector('#sort_by');
        this.loc_addDeviceButton = Selector('a.submitButton').withText('ADD DEVICE');
        this.loc_deviceEdit = Selector('a.device-edit');
        this.loc_deviceRemove = Selector('button.device-remove');
        this.loc_systemInput = Selector('#system_name');
        this.loc_typeDropdown = Selector('#type');
        this.loc_capacityInput = Selector('#hdd_capacity');
        this.updateButton = Selector('button.submitButton').withText('UPDATE');
        this.saveButton = Selector('button.submitButton').withText('SAVE');
        this.deviceMainBox = Selector('.device-main-box');
        this.deviceInformation = this.deviceMainBox.find('.device-info');
        this.deviceOptions = this.deviceMainBox.find('.device-options');
        this.deviceName = this.deviceInformation.find('.device-name');
        this.deviceType = this.deviceInformation.find('.device-type');
        this.deviceCapacity = this.deviceInformation.find('.device-capacity');

    }

    // Function used to add a device
    async addDevice (deviceName, deviceType, capacity) {
        await t
            .typeText(this.loc_systemInput, deviceName)
            .click(this.loc_typeDropdown)
            .click(this.loc_typeDropdown.find('option').withText(deviceType))
            .typeText(this.loc_capacityInput, capacity);

        await t.click(this.saveButton);
    }
}

export default new Page();