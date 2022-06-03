import { View, Text, Image } from 'react-native'
import React from 'react'

export default function index() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
            <Image source={require("../../Assets/Image/logo.png")} style={{ width: 320, height: 320 }} />
        </View>
    )
}