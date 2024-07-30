import page from './page/client-page';

fixture `Ninja One testing challenge`
    .page `http://localhost:3001/`;

    test('Test1', async t => {
        // Api call to retrieve the list of devices.
        const getDevices = await t.request(`http://localhost:3000/devices`).body;

        // Declare variables to store everything except for id, which is not in the UI
        let systemName;
        let type;
        let capacity;

        // Iterate over each device
        getDevices.forEach(async element => {
            // Set device name, type and capacity
            systemName = element.system_name;
            type = element.type;
            capacity = element.hdd_capacity;

            // Verify Name is visible by providing the obtained system_name
            await t.expect(page.deviceName.withText(systemName).visible).ok('Device not found: ' + systemName);
            // Verify Type text is the same as the one in API call
            await t.expect(page.deviceName.withText(systemName).nextSibling('.device-type').innerText).eql(type);
            // Verify Capacity text is the same as the one in API call
            await t.expect(page.deviceName.withText(systemName).nextSibling('.device-capacity').innerText).contains(capacity);
            // Verify Edit button is visible
            await t.expect(Selector(page.deviceName.withText(systemName).parent(page.deviceMainBox).find(page.loc_deviceEdit).visible)).ok('Edit button missing for: ' + systemName);
            // Verify Remove button is visible
            await t.expect(Selector(page.deviceName.withText(systemName).parent(page.deviceMainBox).find(page.loc_deviceRemove).visible)).ok('Remove button missing for: ' + systemName);

        });
    });

    test('Test2', async t => {
        // Set the different type of devices available to test
        const deviceTypes = ['WINDOWS WORKSTATION', 'WINDOWS SERVER', 'MAC'];
        // Since displayed name in UI is different from dropdown, array of UI displayed names is defined
        const deviceDisplayedTypes = ['WINDOWS WORKSTATION', 'WINDOWS_SERVER', 'MAC'];
        const deviceCapacities = ['100', '1', '200'];
        const deviceNames = ['WINDOWS WORKNAME', 'WINDOWS SERVNAME', 'MACNAME' ];

        // Iterate to go through the 3 available device types in add device dropdown
        for (let i = 0; i < deviceNames.length; i++) {
            // Click on Add device button
            await t.click(page.loc_addDeviceButton);
            // Send device name, device type and capacity to function that sets each value
            await page.addDevice(deviceNames[i], deviceTypes[i], deviceCapacities[i]);
            // Verify device was added by device name
            await t.expect(page.deviceName.withText(deviceNames[i]).visible).ok('Device not found: ' + deviceNames[i]);
            // Verify device was added by device type
            await t.expect(page.deviceName.withText(deviceNames[i]).nextSibling('.device-type').innerText).eql(deviceDisplayedTypes[i]);
            // Verify device was added by device capacity
            await t.expect(page.deviceName.withText(deviceNames[i]).nextSibling('.device-capacity').innerText).contains(deviceCapacities[i])
        }
        
    });

    test('Test3', async t => {
        // Get the list of devices
        const getDevices = await t.request(`http://localhost:3000/devices`).body;
        // Retrieve the first element of the get call by using position 0
        let deviceId = getDevices[0].id;
        let type = getDevices[0].type;
        let capacity = getDevices[0].hdd_capacity;
        // Define new name
        let newName = 'Renamed Device';

        // Perform a put to update the device, by using the device id
        await t.request.put({
            url: `http://localhost:3000/devices/${deviceId}`,
            // Body needs to contain the 3 elements to be correctly read in UI
            body: {system_name: `${newName}`, type: `${type}`, hdd_capacity: `${capacity}`}
        });

        // Reload the page
        await t.eval(() => location.reload(true));

        // Verify device new name is in UI
        await t.expect(page.deviceName.withText(newName).visible).ok('Device not found: ' + newName);
        // Verify device type was the one provided
        await t.expect(page.deviceName.withText(newName).nextSibling('.device-type').innerText).eql(type);
        // Verify device capacity was the one provided
        await t.expect(page.deviceName.withText(newName).nextSibling('.device-capacity').innerText).contains(capacity);
        
    });

    test('Test4', async t => {
        // Get request to obtain the list of devices
        const getDevices = await t.request(`http://localhost:3000/devices`).body;
        // Index to retrieve last device
        let lastIndex = getDevices.length - 1;
        // Define last device ID to delete
        let deviceId = getDevices[lastIndex].id;
        // Define device name to verify it was deleted
        let deviceName = getDevices[lastIndex].system_name;

        // Define the amount of devices with the same name. Considering the case there is a repeated device name
        const deviceNameCount = await page.deviceName.withText(deviceName).count;
        // API call to delete the last device
        await t.request.delete(`http://localhost:3000/devices/${deviceId}`);

        // Reload the page to verify element was deleted
        await t.eval(() => location.reload(true));

        // Verify element is not visible by comparing the count before the call and after the call. 
        await t.expect(page.deviceName.withText(deviceName).count).notEql(deviceNameCount);
        
    });
    