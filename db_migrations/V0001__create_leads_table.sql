CREATE TABLE t_p99294159_quantum_innovation_l.leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT,
  area VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);