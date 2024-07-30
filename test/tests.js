import page from './page/client-page';

fixture `Ninja One testing challenge`
    .page `http://localhost:3001/`;

    test('Test1', async t => {
        const getDevices = await t.request(`http://localhost:3000/devices`).body;
        let systemName;
        let type;
        let capacity;

        getDevices.forEach(async element => {
            systemName = element.system_name;
            type = element.type;
            capacity = element.hdd_capacity;

            await t.expect(page.deviceName.withText(systemName).visible).ok('Device not found: ' + systemName);
            await t.expect(page.deviceName.withText(systemName).nextSibling('.device-type').innerText).eql(type);
            await t.expect(page.deviceName.withText(systemName).nextSibling('.device-capacity').innerText).contains(capacity);
            await t.expect(Selector(page.deviceName.withText(systemName).parent(page.deviceMainBox).find(page.loc_deviceEdit).visible)).ok('Edit button missing for: ' + systemName);
            await t.expect(Selector(page.deviceName.withText(systemName).parent(page.deviceMainBox).find(page.loc_deviceRemove).visible)).ok('Remove button missing for: ' + systemName);

        });
    });

    test('Test2', async t => {
        const deviceTypes = ['WINDOWS WORKSTATION', 'WINDOWS SERVER', 'MAC'];
        const deviceDisplayedTypes = ['WINDOWS WORKSTATION', 'WINDOWS_SERVER', 'MAC'];
        const deviceCapacities = ['100', '1', '200'];
        const deviceNames = ['WINDOWS WORKNAME', 'WINDOWS SERVNAME', 'MACNAME' ];

        for (let i = 0; i < deviceNames.length; i++) {
            await t.click(page.loc_addDeviceButton);
            await page.addDevice(deviceNames[i], deviceTypes[i], deviceCapacities[i]);
            await t.expect(page.deviceName.withText(deviceNames[i]).visible).ok('Device not found: ' + deviceNames[i]);
            await t.expect(page.deviceName.withText(deviceNames[i]).nextSibling('.device-type').innerText).eql(deviceDisplayedTypes[i]);
            await t.expect(page.deviceName.withText(deviceNames[i]).nextSibling('.device-capacity').innerText).contains(deviceCapacities[i])
        }
        
    });

    test('Test3', async t => {
        const getDevices = await t.request(`http://localhost:3000/devices`).body;
        let deviceId = getDevices[0].id;
        let type = getDevices[0].type;
        let capacity = getDevices[0].hdd_capacity;
        let newName = 'Renamed Device';

        await t.request.put({
            url: `http://localhost:3000/devices/${deviceId}`,
            body: {system_name: `${newName}`, type: `${type}`, hdd_capacity: `${capacity}`}
        });

        await t.eval(() => location.reload(true));
 
        await t.expect(page.deviceName.withText(newName).visible).ok('Device not found: ' + newName);
        await t.expect(page.deviceName.withText(newName).nextSibling('.device-type').innerText).eql(type);
        await t.expect(page.deviceName.withText(newName).nextSibling('.device-capacity').innerText).contains(capacity);
        
    });

    test('Test4', async t => {
        const getDevices = await t.request(`http://localhost:3000/devices`).body;
        let lastIndex = getDevices.length - 1;
        let deviceId = getDevices[lastIndex].id;
        let deviceName = getDevices[lastIndex].system_name;

        const deviceNameCount = await page.deviceName.withText(deviceName).count;
        await t.request.delete(`http://localhost:3000/devices/${deviceId}`);

        await t.eval(() => location.reload(true));

        await t.expect(page.deviceName.withText(deviceName).count).notEql(deviceNameCount);
        
    });
    