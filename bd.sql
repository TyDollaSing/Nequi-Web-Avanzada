CREATE DATABASE BilleteraDigital;

USE BilleteraDigital;

-- Tabla Clientes
CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    telefono VARCHAR(15),
    saldo DECIMAL(10, 2) DEFAULT 0
);

-- Tabla Transacciones
CREATE TABLE Transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    tipo ENUM('consignacion', 'retiro') NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    cuenta_origen INT NULL,
    cuenta_destino INT NULL,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);

-- Tabla Servicios
CREATE TABLE Servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    tipo ENUM('compra_minutos', 'pago_servicio_publico') NOT NULL,
    monto DECIMAL(10, 2),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);

-- Tabla Logs
CREATE TABLE Logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tabla_impactada VARCHAR(50),
    accion VARCHAR(50),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT
);

-- Trigger para insertar logs automáticamente
DELIMITER //
CREATE TRIGGER log_transacciones AFTER INSERT ON Transacciones
FOR EACH ROW
BEGIN
    INSERT INTO Logs (tabla_impactada, accion, descripcion)
    VALUES ('Transacciones', 'INSERT', CONCAT('Nueva transacción: Tipo=', NEW.tipo, ', Monto=', NEW.monto, ', Cliente ID=', NEW.cliente_id));
END;
//

DELIMITER //
CREATE TRIGGER log_servicios AFTER INSERT ON Servicios
FOR EACH ROW
BEGIN
    INSERT INTO Logs (tabla_impactada, accion, descripcion)
    VALUES ('Servicios', 'INSERT', CONCAT('Nuevo servicio: Tipo=', NEW.tipo, ', Monto=', NEW.monto, ', Cliente ID=', NEW.cliente_id));
END;
//
DELIMITER ;