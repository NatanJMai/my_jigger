require 'rails_helper'

RSpec.describe "Public", type: :request do
  describe "GET /index" do
    it "works! (now write some real specs)" do
      get index_path
      expect(response).to have_http_status(200)
    end
  end
end
