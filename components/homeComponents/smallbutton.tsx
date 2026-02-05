import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";


export const SettingButtonTrayning: React.FC<{ title: string , children: React.ReactNode, style?: any, onPress?: () => void }> = ({ title, children, style, onPress }) => (
    <TouchableOpacity style={style} onPress={onPress}>
        <View style={localStyles.content}>
            <ThemedText style={localStyles.title}>{title}</ThemedText>
            {children}
        </View>
    </TouchableOpacity>
);

const localStyles = StyleSheet.create({
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        // fontSize: 8,
        marginBottom: 2,
        margin:2,
    },
});