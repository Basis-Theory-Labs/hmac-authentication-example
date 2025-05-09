terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 0.8.0"
    }
  }
}

variable "management_api_key" {}
variable "signature_key" {}


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


resource "basistheory_proxy" "pixxles_proxy" {
  name               = "pixxles Proxy"
  destination_url    = "https://qa-transactions.pixxlesportal.com/direct" # replace this with the destination API url
  request_transform = {
    code = file("./authenticate.js")
  }
  configuration = {
    SIGNATURE_KEY = var.signature_key
  }
  require_auth = true
}

## OUTPUTS
output "pixxles_proxy_key" {
  value       = basistheory_proxy.pixxles_proxy.key
  description = "Pixxles Proxy Key"
  sensitive   = true
}

output "backend_application_key" {
  value       = basistheory_application.backend_application.key
  description = "Backend Application Key"
  sensitive   = true
}