BT_MANAGEMENT_KEY=$(terraform console <<< "var.bt_management_api_key" | sed 's/^"\(.*\)"$/\1/')
bt proxies update $(terraform output -raw ingo_proxy_id) -q authenticate.js -wl -x $BT_MANAGEMENT_KEY
