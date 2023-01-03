import {networkInterfaces} from "os";
const macRegex = /(?:[a-z0-9]{1,2}[:-]){5}[a-z0-9]{1,2}/i
const zeroRegex = /(?:[0]{1,2}[:-]){5}[0]{1,2}/
export default function getMAC(iface = null) {
    var macAddress = "";
    var user_address_ip = "";
    var your_computernm = "";
    var wmi = undefined

    if (window.DOMParser)
    { // Firefox, Chrome, Opera, etc.
        wmi =new DOMParser();
    }
    else // Internet Explorer
    {
        wmi = new ActiveXObject("winmgmts:{impersonationLevel=impersonate}");
    }
    // var wmi = new ActiveXObject("WbemScripting.SWbemLocator");
    var s = wmi
    let e =  s.ExecQuery("SELECT * FROM Win32_NetworkAdapterConfiguration WHERE IPEnabled = True")
    for(; !e.atEnd(); e.moveNext()) {
        var s = e.item();
        macAddress = s.MACAddress;
        user_address_ip = s.IPAddress(0);
        your_computernm = s.DNSHostName;
    }
    return {
        macAddress: macAddress,
        user_address_ip: user_address_ip,
        your_computernm: your_computernm
    }
}
