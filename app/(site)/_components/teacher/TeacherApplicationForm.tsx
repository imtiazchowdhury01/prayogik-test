//@ts-nocheck
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  GraduationCap,
  User,
  Globe,
  Phone,
  MapPin,
  Plus,
  X,
  BookOpen,
  Award,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import RequiredFieldStar from "@/components/common/requiredFieldStar";

export default function TeacherApplicationForm() {
  const [date, setDate] = useState<Date>();
  const [experienceLevel, setExperienceLevel] = useState("");
  const [degrees, setDegrees] = useState([
    { degree: "", major: "", passingYear: "" },
  ]);
  const [certifications, setCertifications] = useState([{ name: "", url: "" }]);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            শিক্ষকতার জন্য আবেদন করুন
          </h1>
          <p className="text-gray-600">
            আমাদের সাথে যোগ দিন এবং শিক্ষার্থীদের ভবিষ্যৎ গড়তে সাহায্য করুন
          </p>
        </div>

        <form className="space-y-8">
          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                পেশাগত তথ্য
              </CardTitle>
              <CardDescription>
                আপনার শিক্ষাগত যোগ্যতা এবং অভিজ্ঞতার বিবরণ দিন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialization">বিশেষায়িত ক্ষেত্র *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">গণিত</SelectItem>
                      <SelectItem value="physics">পদার্থবিজ্ঞান</SelectItem>
                      <SelectItem value="chemistry">রসায়ন</SelectItem>
                      <SelectItem value="biology">জীববিজ্ঞান</SelectItem>
                      <SelectItem value="english">ইংরেজি</SelectItem>
                      <SelectItem value="bangla">বাংলা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience-years">অভিজ্ঞতার বছর</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="বছর নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">০-১ বছর</SelectItem>
                      <SelectItem value="2-5">২-৫ বছর</SelectItem>
                      <SelectItem value="6-10">৬-১০ বছর</SelectItem>
                      <SelectItem value="10+">১০+ বছর</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>অভিজ্ঞতার স্তর *</Label>
                <RadioGroup
                  value={experienceLevel}
                  onValueChange={setExperienceLevel}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="entry" id="entry" />
                    <Label htmlFor="entry">নতুন</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mid" id="mid" />
                    <Label htmlFor="mid">মধ্যম</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expert" id="expert" />
                    <Label htmlFor="expert">বিশেষজ্ঞ</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">সার্টিফিকেশন</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCertifications([
                        ...certifications,
                        { name: "", url: "" },
                      ])
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    যোগ করুন
                  </Button>
                </div>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-sm">
                            সার্টিফিকেশন {index + 1}
                          </span>
                        </div>
                        {certifications.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setCertifications(
                                certifications.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`cert-name-${index}`}>
                            সার্টিফিকেটের নাম *
                          </Label>
                          <Input
                            id={`cert-name-${index}`}
                            placeholder="যেমন: IELTS, TOEFL, Google Analytics"
                            value={cert.name}
                            onChange={(e) => {
                              const updated = [...certifications];
                              updated[index].name = e.target.value;
                              setCertifications(updated);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`cert-url-${index}`}>
                            সার্টিফিকেট URL
                          </Label>
                          <Input
                            id={`cert-url-${index}`}
                            placeholder="https://certificate-url.com"
                            value={cert.url}
                            onChange={(e) => {
                              const updated = [...certifications];
                              updated[index].url = e.target.value;
                              setCertifications(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                সামাজিক যোগাযোগ
              </CardTitle>
              <CardDescription>
                আপনার অনলাইন উপস্থিতি এবং পোর্টফোলিও লিংক যোগ করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">ওয়েবসাইট</Label>
                  <Input id="website" placeholder="https://yourwebsite.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="LinkedIn প্রোফাইল URL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" placeholder="Facebook প্রোফাইল URL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input id="youtube" placeholder="YouTube চ্যানেল URL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" placeholder="Twitter প্রোফাইল URL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="others">অন্যান্য</Label>
                  <Input id="others" placeholder="অন্য কোনো প্রাসঙ্গিক লিংক" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                আপনার সম্পর্কে
              </CardTitle>
              <CardDescription>
                ব্যক্তিগত তথ্য এবং যোগাযোগের বিবরণ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">জীবনী *</Label>
                <Textarea
                  id="bio"
                  placeholder="আপনার শিক্ষাগত পটভূমি, অভিজ্ঞতা এবং শিক্ষাদানের প্রতি আগ্রহের কথা লিখুন..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">ফোন নম্বর *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="+880 1XXX-XXXXXX"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>জন্ম তারিখ *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span>তারিখ নির্বাচন করুন</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">লিঙ্গ *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="লিঙ্গ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">পুরুষ</SelectItem>
                      <SelectItem value="female">মহিলা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">জাতীয়তা *</Label>
                  <Input id="nationality" placeholder="বাংলাদেশী" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">শহর</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="city"
                      placeholder="শহরের নাম"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">রাজ্য/বিভাগ</Label>
                  <Input id="state" placeholder="বিভাগের নাম" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">দেশ</Label>
                  <Input id="country" placeholder="বাংলাদেশ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode">পোস্ট কোড</Label>
                  <Input id="zipcode" placeholder="১২০০" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    শিক্ষাগত যোগ্যতা
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDegrees([
                        ...degrees,
                        { degree: "", major: "", passingYear: "" },
                      ])
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    ডিগ্রি যোগ করুন
                  </Button>
                </div>
                <div className="space-y-4">
                  {degrees.map((degree, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-sm">
                            ডিগ্রি {index + 1}
                          </span>
                        </div>
                        {degrees.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDegrees(degrees.filter((_, i) => i !== index))
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`degree-${index}`}>
                            <RequiredFieldStar
                              labelText={"ডিগ্রির ধরন"}
                              className={"text-base font-medium"}
                            />
                          </Label>
                          <Select
                            value={degree.degree}
                            onValueChange={(value) => {
                              const updated = [...degrees];
                              updated[index].degree = value;
                              setDegrees(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="ডিগ্রি নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ssc">এসএসসি</SelectItem>
                              <SelectItem value="hsc">এইচএসসি</SelectItem>
                              <SelectItem value="diploma">ডিপ্লোমা</SelectItem>
                              <SelectItem value="bachelor">স্নাতক</SelectItem>
                              <SelectItem value="master">
                                স্নাতকোত্তর
                              </SelectItem>
                              <SelectItem value="phd">পিএইচডি</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>
                            <RequiredFieldStar
                              labelText={"বিষয়"}
                              className={"text-base font-medium"}
                            />
                          </Label>
                          <Select
                            value={degree.major}
                            onValueChange={(value) => {
                              const updated = [...degrees];
                              updated[index].major = value;
                              setDegrees(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mathematics">গণিত</SelectItem>
                              <SelectItem value="physics">
                                পদার্থবিজ্ঞান
                              </SelectItem>
                              <SelectItem value="chemistry">রসায়ন</SelectItem>
                              <SelectItem value="biology">
                                জীববিজ্ঞান
                              </SelectItem>
                              <SelectItem value="english">ইংরেজি</SelectItem>
                              <SelectItem value="bangla">বাংলা</SelectItem>
                              <SelectItem value="history">ইতিহাস</SelectItem>
                              <SelectItem value="geography">ভূগোল</SelectItem>
                              <SelectItem value="economics">
                                অর্থনীতি
                              </SelectItem>
                              <SelectItem value="political-science">
                                রাষ্ট্রবিজ্ঞান
                              </SelectItem>
                              <SelectItem value="sociology">
                                সমাজবিজ্ঞান
                              </SelectItem>
                              <SelectItem value="philosophy">দর্শন</SelectItem>
                              <SelectItem value="computer-science">
                                কম্পিউটার সায়েন্স
                              </SelectItem>
                              <SelectItem value="engineering">
                                ইঞ্জিনিয়ারিং
                              </SelectItem>
                              <SelectItem value="business">
                                ব্যবসায় শিক্ষা
                              </SelectItem>
                              <SelectItem value="other">অন্যান্য</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`passing-year-${index}`}>
                            পাশের সাল
                          </Label>
                          <Input
                            id={`passing-year-${index}`}
                            placeholder="২০২৩"
                            value={degree.passingYear}
                            onChange={(e) => {
                              const updated = [...degrees];
                              updated[index].passingYear = e.target.value;
                              setDegrees(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" size="lg" className="px-12 py-3 text-lg">
              আবেদন জমা দিন
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
