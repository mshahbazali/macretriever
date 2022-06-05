import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, Share, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Network from 'expo-network';
import NetInfo from "@react-native-community/netinfo";
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Application from 'expo-application';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function index() {
    const [macAddress, setMacAddress] = useState()
    const [iosMacAddress, setIosMacAddress] = useState()
    const [vendor, setVendor] = useState()
    const [brand, setBrand] = useState()
    const [model, setModel] = useState()
    const [wifi, setWifi] = useState()
    const [ip, setIp] = useState()
    const [ssid, setSsid] = useState()
    const [bssid, setBssid] = useState()
    const [os, setOs] = useState()
    const [osVersion, setOsVersion] = useState()
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    useEffect(() => {
        setVendor(Device.manufacturer);
        setBrand(Device.brand);
        setModel(Device.modelName);
        NetInfo.addEventListener(state => {
            state.isConnected == true ? setWifi("Connected") : setWifi("Disconnected");
            setBssid(state.details.bssid);
            setSsid(state.details.ssid);
        });
        Network.getIpAddressAsync().then((ip) => {
            setIp(ip)
        });
        setOs(Device.osName);
        setOsVersion(Device.osVersion);
        Location.requestForegroundPermissionsAsync().then((permission) => { });

    }, [])
    useEffect(() => {
        const macAddress = async () => {
            if (Device.osName == "Android") {
                setMacAddress(Application.androidId)
            }
            else {
                Network.getMacAddressAsync()
                    .then((macAddress) => {
                        setIosMacAddress(macAddress)
                    })
                    .catch((error) => console.log(error));
                await Application.getIosIdForVendorAsync().then((res) => {
                    setMacAddress(res)
                })
            }
        }
        macAddress()
    }, [macAddress])
    const data = [
        {
            name: "Vendor",
            value: vendor
        },
        {
            name: "Brand",
            value: brand
        },
        {
            name: "Model",
            value: model
        },
        {
            name: "Wifi",
            value: wifi
        },
        {
            name: "Local Ip",
            value: ip
        },
        {
            name: "SSID",
            value: ssid
        },
        {
            name: "BSSID",
            value: macAddress
        },
        {
            name: "Operating System",
            value: os
        },
        {
            name: "OS Version",
            value: osVersion
        }
    ]
    const copyText = async (text) => {
        await Clipboard.setStringAsync(text);
        let toast = Toast.show(`${text} has been copied`, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
        setTimeout(function () {
            Toast.hide(toast);
        }, 1500);
    };
    const onShare = async () => {
        try {
            await Share.share({
                message: `Device Info ${"\n"} ========= ${"\n"} Mac Address: ${bssid} ${"\n"} Vendor: ${vendor} ${"\n"} Brand: ${brand} ${"\n"} Model: ${model} ${"\n"} ${"\n"} Wifi Info ${"\n"} ======= ${"\n"} Wifi: ${wifi} ${"\n"} Local Ip: ${ip} ${"\n"} SSID: ${ssid} ${"\n"} BSSID: ${macAddress} ${"\n"} Operating System: ${os} OS Version: ${osVersion}`,
            });
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Mac Retriever</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ marginHorizontal: 13 }}>
                            <TouchableOpacity onPress={onRefresh}>
                                <FontAwesome name="refresh" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={onShare}>
                                <Ionicons name="share-social" size={26} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={() => { copyText(bssid) }}>
                        <View style={styles.macAddressBox}>
                            <Text style={styles.macText}>{Device.osName == 'Android' ? bssid : iosMacAddress}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 27, alignItems: 'center', marginVertical: 20 }}>
                    {
                        data.map((e, i) => {
                            return (
                                <TouchableOpacity key={i} onPress={() => { copyText(e.value) }}>
                                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                        <View style={{ borderBottomColor: "grey", borderBottomWidth: 1, paddingVertical: 5, width: '50%', marginVertical: 5 }}>
                                            <Text style={{ fontSize: 16 }}>{e.name}</Text>
                                        </View>
                                        <View style={{ borderBottomColor: "grey", borderBottomWidth: 1, paddingVertical: 5, width: '50%', marginVertical: 5 }}>
                                            <Text style={{ fontSize: 16 }}>{e.value}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#1C4E71",
        marginTop: Device.osName == 'Android' ? 25 : 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,

    },
    headerTitle: {
        color: "white",
        fontWeight: '500',
        fontSize: 20
    },
    macAddressBox: {
        marginVertical: 20,
        marginHorizontal: 27,
        borderColor: "#5D7180",
        borderWidth: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#5D7180"
    },
    macText: {
        color: "white",
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center'
    }
})