terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 0.8.0"
    }
  }
}

variable "management_api_key" {}
variable "destination_public_key" {}
variable "destination_private_key" {}

provider "basistheory" {
  api_key = var.management_api_key
}

resource "basistheory_application" "backend_application" {
  name        = "Backend"
  type        = "private"
  rule {
    description = "Use cards"
    priority    = 1
    container   = "/pci/high/"
    transform   = "reveal"
    permissions = [
      "token:use"
    ]
  }
}


resource "basistheory_proxy" "hmac_proxy" {
  name               = "HMAC Proxy"
  destination_url    = "https://echo.basistheory.com/anything" # replace this with the destination API url
  request_transform = {
    code = file("./authenticate.js")
  }
  configuration = {
    DESTINATION_PUBLIC_KEY = var.destination_public_key
    DESTINATION_PRIVATE_KEY = var.destination_private_key
  }
  require_auth = true
}

## OUTPUTS
output "hmac_proxy_key" {
  value       = basistheory_proxy.hmac_proxy.key
  description = "HMAC Proxy Key"
  sensitive   = true
}

output "backend_application_key" {
  value       = basistheory_application.backend_application.key
  description = "Backend Application Key"
  sensitive   = true
}