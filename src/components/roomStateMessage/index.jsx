function RoomStateMessage({ color, message }) {

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '25px'
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
        display: 'flex',
        alignItems: 'center',
        margin: '2px'
    }

    return (
        <div style={containerStyle}>
            <div style={colorCardStyle}></div>
            <div style={msgStyle}>{message}</div>
        </div>
    )
}

export { RoomStateMessage };

