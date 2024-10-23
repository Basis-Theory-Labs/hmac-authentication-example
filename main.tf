terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 2.2.0"
    }
  }
}

variable "bt_management_api_key" {}
variable "dlocal_secret_key" {}

provider "basistheory" {
  api_key = var.bt_management_api_key
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

resource "basistheory_application_key" "backend_application_key" {
  application_id = basistheory_application.backend_application.id
}


resource "basistheory_proxy" "dlocal_proxy" {
  name               = "dLocal Proxy"
  destination_url    = "https://sandbox.dlocal.com/"
  request_transform = {
    code = file("./authenticate.js")
  }
  require_auth = true
  configuration = {
    DLOCAL_SECRET_KEY = var.dlocal_secret_key
  }
}

## OUTPUTS
output "dlocal_proxy_key" {
  value       = basistheory_proxy.dlocal_proxy.key
  description = "dLocal Proxy Key"
  sensitive   = true
}

output "backend_application_key" {
  value       = basistheory_application_key.backend_application_key.key
  description = "Backend Application Key"
  sensitive   = true
}
