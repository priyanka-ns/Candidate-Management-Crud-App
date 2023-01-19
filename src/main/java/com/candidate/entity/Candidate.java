package com.candidate.entity;

import javax.persistence.*;

@Entity
@Table(name = "candidate")
@SecondaryTable(name="details", pkJoinColumns=
@PrimaryKeyJoinColumn(name="c_id"))
public class Candidate {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String candidateFirstName;
	
	private String candidateLastName;
	private String candidateEmail;
	private long phoneNo;
	@Column(table = "details")
	private String location;
	@Column(table = "details")
	private String education;
	@Column(table = "details")
	private float experience;
	@Column(table = "details")
	private String source;
	@Column(table = "details")
	private String status;


	public Candidate() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Candidate(String candidateFirstName, String candidateLastName, String candidateEmail, long phoneNo, String location, String education, float experience, String source, String status) {
		super();
		this.candidateFirstName = candidateFirstName;
		this.candidateLastName = candidateLastName;
		this.candidateEmail = candidateEmail;
		this.phoneNo = phoneNo;
		this.location = location;
		this.education = education;
		this.experience = experience;
		this.source = source;
		this.status = status;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCandidateFirstName() {
		return candidateFirstName;
	}

	public void setCandidateFirstName(String candidateFirstName) {
		this.candidateFirstName = candidateFirstName;
	}

	public String getCandidateLastName() {
		return candidateLastName;
	}

	public void setCandidateLastName(String candidateLastName) {
		this.candidateLastName = candidateLastName;
	}

	public String getCandidateEmail() {
		return candidateEmail;
	}

	public void setCandidateEmail(String candidateEmail) {
		this.candidateEmail = candidateEmail;
	}

	public long getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(long phoneNo) {
		this.phoneNo = phoneNo;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getEducation() {
		return education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	public float getExperience() {
		return experience;
	}

	public void setExperience(float experience) {
		this.experience = experience;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "Candidate{" +
				"id=" + id +
				", candidateFirstName='" + candidateFirstName + '\'' +
				", candidateLastName='" + candidateLastName + '\'' +
				", candidateEmail='" + candidateEmail + '\'' +
				", phoneNo='" + phoneNo + '\'' +
				", location='" + location + '\'' +
				", education='" + education + '\'' +
				", experience=" + experience +
				", source='" + source + '\'' +
				", status='" + status + '\'' +
				'}';
	}
}
