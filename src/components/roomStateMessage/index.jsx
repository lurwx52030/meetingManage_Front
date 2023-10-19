function RoomStateMessage({ color, message }) {

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        margin: '10px'
    }

    const colorCardStyle = {
        backgroundColor: color,
        width: '40%',
        height: '80px',
        margin: '2px'
    }

    const msgStyle = {
        width: '65%',
        height: '80px',
        alignItems: 'center',
        display: 'flex',
        margin: '2px'
    }

    return (
        <div style={containerStyle}>
            <div style={colorCardStyle}></div>
            <p style={msgStyle}>{message}</p>
        </div>
    )
}

export { RoomStateMessage };
