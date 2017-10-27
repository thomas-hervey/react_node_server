function localtunnel {
  lt -s shroudedcitadel85578 --port 5000
}
until localtunnel; do
echo "localtunnel server crashed"
sleep 2
done
