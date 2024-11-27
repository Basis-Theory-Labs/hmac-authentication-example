terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 2.2.0"
    }
  }
}

variable "bt_management_api_key" {}
variable "ingo_secret" {}
variable "ingo_username" {}

provider "basistheory" {
  api_key = var.bt_management_api_key
}

resource "basistheory_application" "backend_application" {
  name = "Backend"
  type = "private"
  rule {
    description = "Use cards"
    priority    = 1
    container   = "/pci/high/"
    transform   = "reveal"
    permissions = [
      "token:use",
      "token:create"
    ]
  }
}

resource "basistheory_application_key" "backend_application_key" {
  application_id = basistheory_application.backend_application.id
}


resource "basistheory_proxy" "ingo_proxy" {
  name            = "Ingo Payments Proxy"
  destination_url = "https://payapi-sandbox.ingo.money"
  # destination_url = "https://echo.basistheory.com/anything"
  request_transform = {
    code = file("./authenticate.js")
  }
  require_auth = true
  configuration = {
    INGO_USERNAME = var.ingo_username
    INGO_SECRET   = var.ingo_secret
  }
}

## OUTPUTS
output "ingo_proxy_key" {
  value       = basistheory_proxy.ingo_proxy.key
  description = "Ingo Payments Proxy Key"
  sensitive   = true
}
output "ingo_proxy_id" {
  value       = basistheory_proxy.ingo_proxy.id
  description = "Ingo Payments Proxy ID"
}

output "backend_application_key" {
  value       = basistheory_application_key.backend_application_key.key
  description = "Backend Application Key"
  sensitive   = true
}




