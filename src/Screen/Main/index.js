import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Network from 'expo-network';
import NetInfo from "@react-native-community/netinfo";
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Application from 'expo-application';

export default function index() {
    const [macAddress, setMacAddress] = useState()
    const [vendor, setVendor] = useState()
    const [brand, setBrand] = useState()
    const [model, setModel] = useState()
    const [wifi, setWifi] = useState()
    const [ip, setIp] = useState()
    const [ssid, setSsid] = useState()
    const [bssid, setBssid] = useState()
    const [os, setOs] = useState()
    const [osVersion, setOsVersion] = useState()

    useEffect(() => {
        setVendor(Device.manufacturer)
        setBrand(Device.brand)
        setModel(Device.modelName)
        NetInfo.addEventListener(state => {
            state.isConnected == true ? setWifi("Enable") : setWifi("Disable")
            setBssid(state.details.bssid)
            setSsid(state.details.ssid)
        });
        Network.getIpAddressAsync().then((ip) => {
            setIp(ip)
        })
        setOs(Device.osName)
        setOsVersion(Device.osVersion)
        Location.requestForegroundPermissionsAsync().then((permission) => { })

    }, [])
    const a = ''
    useEffect(() => {
        if (os === "Android") {
            setMacAddress(Application.androidId)
            console.log(Application.androidId);
            console.log(os);
        }
        else {
            Application.getIosIdForVendorAsync().then((res) => {
                setMacAddress(res)
            })
        }
    }, [macAddress])

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Mac Address</Text>
                </View>
                <View>
                    <View>
                        <Ionicons name="share-social" size={24} color="white" />
                    </View>
                </View>
            </View>
            <View>
                <View style={styles.macAddressBox}>
                    <Text style={styles.macText}>{macAddress}</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 27, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>

                </View>
                <View>

                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#1C4E71",
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,

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