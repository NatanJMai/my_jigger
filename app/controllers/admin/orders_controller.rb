class Admin::OrdersController < AdminController
  load_and_authorize_resource
  load_and_authorize_resource :organization

  decorates_assigned :orders, :order, :order_items, :organization

  # GET /organizations or /organizations.json
  def index
    @orders = current_organization.orders.order(:date, :order_number).decorate
  end

  # GET /organizations/1 or /organizations/1.json
  def show
    @order_items = @order.order_items
  end

  def new
    @order = @organization.orders.new(data_imported: false)
    @order.order_items.build
  end

  def create
    @order = @organization.orders.new(order_params)

    if @order.save
      redirect_to [:admin, @order], notice: 'Order was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @order.update(order_params)
      redirect_to [:admin, @organization, :orders], notice: 'Order was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @order.destroy
    redirect_to [:admin, @organization, :orders], notice: 'Order deleted successfully.'
  end

  private

  def order_params
    params.require(:order).permit(
      :organization_id,
      :order_number,
      :date,
      :data_imported,

      order_items_attributes: [
        :id,
        :item_id,
        :quantity,
        :unit_price_cents,
        :_destroy
      ]
    )
  end
end
