class ItemStatus < ClassyEnum::Base
end

class ItemStatus::Done < ItemStatus
end

class ItemStatus::InProgress < ItemStatus
end

class ItemStatus::NotDone < ItemStatus
end
