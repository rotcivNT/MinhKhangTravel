import { sendMessage } from "@/api";
import { AutoComplete } from "@/components/AutoComplete";
import CommonDialog from "@/components/CommonDialog";
import { DatePickerWithRange } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { vietNamAddressFormat } from "@/data";
import { toLowerCaseNonAccentVietnamese } from "@/helper";
import { ApiPayload } from "@/types/api-payload";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues: {
    startPoint: string;
    endPoint: string;
  };
}

export default function InterprivincialRentalModal({
  isModalOpen,
  setIsModalOpen,
  defaultValues,
}: IProps) {
  const [startPoints, setStartPoints] = useState(vietNamAddressFormat);
  const [endPoints, setEndPoints] = useState(vietNamAddressFormat);
  const [selectedStartPoint, setSelectedStartPoint] = useState("");
  const [selectedEndPoint, setSelectedEndPoint] = useState("");
  const [searchStartPointValue, setSearchStartPointValue] = useState("");
  const [searchEndPointValue, setSearchEndPointValue] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const resetData = () => {
    setSelectedStartPoint("");
    setSelectedEndPoint("");
    setPhone("");
    setMessage("");
    setDateRange(undefined);
  };

  const onSubmit = async () => {
    const messageString = `Tỉnh đi: ${selectedStartPoint}\nTỉnh đến: ${selectedEndPoint}\n
    Số điện thoại liên hệ: ${phone}\nNgày bắt đầu: ${
      dateRange?.from ? dateRange.from.toLocaleDateString("vi-VN") : ""
    }\nNgày kết thúc: ${
      dateRange?.to ? dateRange.to.toLocaleDateString("vi-VN") : ""
    }\nLời nhắn: ${message}`;

    const payload: ApiPayload = {
      phone: phone,
      message: messageString,
    };
    const res = await sendMessage(payload);
    if (res) {
      resetData();
      setIsModalOpen(false);
      toast("Để lại lời nhắn thành công");
    } else {
      toast("Đặt xe thất bại. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    const filteredPoints = vietNamAddressFormat.filter((item) => {
      return toLowerCaseNonAccentVietnamese(item.label).includes(
        toLowerCaseNonAccentVietnamese(searchStartPointValue)
      );
    });
    setStartPoints(filteredPoints);
  }, [searchStartPointValue]);

  useEffect(() => {
    const filteredPoints = vietNamAddressFormat.filter((item) => {
      return toLowerCaseNonAccentVietnamese(item.label).includes(
        toLowerCaseNonAccentVietnamese(searchEndPointValue)
      );
    });
    setEndPoints(filteredPoints);
  }, [searchEndPointValue]);

  useEffect(() => {
    const { startPoint, endPoint } = defaultValues;
    setSelectedStartPoint(startPoint || "");
    setSearchStartPointValue(startPoint || "");
    setSelectedEndPoint(endPoint || "");
    setSearchEndPointValue(endPoint || "");
  }, [defaultValues]);

  return (
    <CommonDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
      <div className="grid grid-cols-1 gap-y-5">
        <div className="space-y-2">
          <label className="block text-gray-800 font-medium text-sm">
            Tỉnh đi <span className="text-red-600">*</span>
          </label>
          <AutoComplete
            selectedValue={selectedStartPoint}
            onSelectedValueChange={setSelectedStartPoint}
            searchValue={searchStartPointValue}
            onSearchValueChange={setSearchStartPointValue}
            items={startPoints}
            emptyMessage="Không tìm thấy kết quả"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-800 font-medium text-sm">
            Tỉnh đến <span className="text-red-600">*</span>
          </label>
          <AutoComplete
            selectedValue={selectedEndPoint}
            onSelectedValueChange={setSelectedEndPoint}
            searchValue={searchEndPointValue}
            onSearchValueChange={setSearchEndPointValue}
            items={endPoints}
            emptyMessage="Không tìm thấy kết quả"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-800 font-medium text-sm">
            Số điện thoại liên hệ <span className="text-red-600">*</span>
          </label>
          <Input
            type="tel"
            value={phone}
            placeholder="Nhập số điện thoại của bạn"
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-md p-2"
          />
        </div>

        <div>
          <DatePickerWithRange
            className="[&_button]:!w-full"
            date={dateRange}
            setDate={setDateRange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-800 font-medium text-sm">
            Lời nhắn
          </label>
          <Textarea
            id="message"
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập lời nhắn"
            className="w-full"
            value={message}
          />
        </div>
      </div>

      <Button
        onClick={onSubmit}
        type="submit"
        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Đặt xe
      </Button>
    </CommonDialog>
  );
}
