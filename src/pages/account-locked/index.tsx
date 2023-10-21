export default function NotFound() {

    return <div style={{
        width: '100%',
        height: '100%',
        background: "white",
        position: 'absolute',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
        userSelect: "none"
    }}>
        <img
            style={{
                width: '100%',
                height: '100%',
            }}
            src='/prison_full.jpg' alt={'Accept Permission'}/>
        <label style={{
            position: "absolute",
            borderRadius: 20,
            background: "white",
            padding: 20,
            backgroundColor: "red",
            color: "yellow",
            border: "2px solid white",
            maxWidth: "80%",
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center"
        }}>Tài khoản của bạn đã bị khóa</label>
    </div>
}
NotFound.layout = "client"