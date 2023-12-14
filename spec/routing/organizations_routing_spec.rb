require "rails_helper"

RSpec.describe Admin::OrganizationsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/admin/organizations").to route_to("admin/organizations#index")
    end

    it "routes to #new" do
      expect(get: "/admin/organizations/new").to route_to("admin/organizations#new")
    end

    it "routes to #show" do
      expect(get: "/admin/organizations/1").to route_to("admin/organizations#show", id: "1")
    end

    it "routes to #edit" do
      expect(get: "/admin/organizations/1/edit").to route_to("admin/organizations#edit", id: "1")
    end
  end
end
