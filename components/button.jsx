import { StyleSheet, Text, Pressable, View } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import Loading from "./loading";

const button = ({
                    buttonStyle,
                    textStyle,
                    title = '',
                    onPress = () => {},
                    loading = false,
                    hasShadow = true,
                }) => {
    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    };

    if (loading) {
        return (
            <View style={[styles.button, buttonStyle, { backgroundColor: 'white' }]}>
                <Loading />
            </View>
        );
    }

    return (
        <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </Pressable>
    );
};

export default button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        height: hp(7.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.radius.xxl,
    },
    text: {
        color: theme.colors.white,
        fontSize: hp(2.5),
        fontWeight: theme.fonts.bold,
    },
});
