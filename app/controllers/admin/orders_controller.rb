class Admin::OrdersController < AdminController
  load_and_authorize_resource

  decorates_assigned :orders, :order

  # GET /organizations or /organizations.json
  def index
    @orders = current_organization.orders.order(:date, :order_number)
  end

  # GET /organizations/1 or /organizations/1.json
  def show
  end
end
