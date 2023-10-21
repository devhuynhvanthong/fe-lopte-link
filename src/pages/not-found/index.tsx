export default function NotFound() {

    return <div style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
        gap: 10,
        userSelect: "none"
    }}>
        <img
            style={{
                width: 300,
                maxWidth: '80%',
            }}
            src='/not-found.png' alt={'Accept Permission'}/>
        <label style={{
            maxWidth: "80%",
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center"
        }}>Không tìm thấy trang</label>
    </div>
}
NotFound.layout = "client"