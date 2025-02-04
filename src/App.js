import React, { useState } from 'react';

function App() {
  const [port, setPort] = useState(null); // Store the serial port object
  const [receivedData, setReceivedData] = useState(''); // Store received data
  const [lastAction,setLastAction]=useState(null);

  // Request access to a serial port
  const requestPort = async () => {
    try {
      const port = await navigator.serial.requestPort(); //request access to a serial port
      await port.open({ baudRate: 9600 }); // Open the port with a baud rate of 9600
      setPort(port);
      alert('Serial port connected successfully!');
    } catch (error) {
      console.error('Error accessing serial port:', error);
      alert('Failed to connect to the serial port.');
    }
  };

  // Send data to the serial port
  const sendData = async () => {
    if (!port) {
      alert('No serial port connected.');
      return;
    }

    const writer = port.writable.getWriter();
    const data = new TextEncoder().encode('Hello, Serial Port!'); // Encode the data
    await writer.write(data); // Send the data
    writer.releaseLock(); // Release the writer
    setLastAction('send');
    alert('Data sent successfully!');
  };

  // Read data from the serial port
  const readData = async () => {
    if (!port) {
      alert('No serial port connected.');
      return;
    }

    let reader;
    try {
      reader = port.readable.getReader(); // Get a reader
      let receivedText = '';

      while (true) {

        const { value, done } = await reader.read();
        if (done) break; // Exit if the stream is closed
        receivedText += new TextDecoder().decode(value); // Decode the received data
        setReceivedData(receivedText); // Update the state with received data
        setLastAction('read');
      }

    } catch (error) {
      console.error('Error reading data:', error);
      alert(error.message);
    } finally {
      if (reader) {
        reader.releaseLock(); // Release the reader
      }
    }
  };

  const closePort = async () => {
    if (port) {
      await port.close(); // Close the port
      setPort(null); // Reset the port state
      alert('Serial port closed successfully!');
    } else {
      alert('No serial port is open.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Serial Port Communication</h1>
      <button onClick={requestPort} style={buttonStyle}>
        Connect to Serial Port
      </button>
      <button onClick={sendData} style={buttonStyle}>
        Send Data
      </button>
      <button onClick={readData} style={buttonStyle}>
        Read Data
      </button>
      <button onClick={closePort} style={buttonStyle}>
        Close Port
      </button>
      <div>
        <h2>Received Data:</h2>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {lastAction === 'read' && "Read From Serial Port: " + receivedData}
          {lastAction === 'send' && "Send To Putty: Hello, Serial Port!"}
        </pre>
      </div>
    </div>
  );
}

// Basic button styling
const buttonStyle = {
  margin: '5px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default App;