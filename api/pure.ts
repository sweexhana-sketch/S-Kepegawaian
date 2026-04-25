export default function handler(req, res) {
  res.status(200).json({
    message: 'Hello from pure Node.js endpoint!',
    status: 'success'
  });
}
